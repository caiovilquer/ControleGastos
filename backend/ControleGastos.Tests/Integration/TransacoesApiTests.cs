using System.Net;
using System.Net.Http.Json;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using ControleGastos.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Tests.Integration;

public class TransacoesApiTests : IClassFixture<ControleGastosWebApplicationFactory>, IAsyncLifetime
{
    private readonly ControleGastosWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public TransacoesApiTests(ControleGastosWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync() => await _factory.ResetDatabaseAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Post_ComDadosValidos_Retorna201()
    {
        var pessoa = await CriarPessoaAsync("Ana", 30);

        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "Salário",
            valor = 2500.75m,
            tipo = "Receita"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var criada = await response.Content.ReadFromJsonAsync<TransacaoResponse>(TestJsonOptions.Instance);
        Assert.NotNull(criada);
        Assert.True(criada.Id > 0);
        Assert.Equal(pessoa.Id, criada.PessoaId);
        Assert.Equal("Ana", criada.PessoaNome);
        Assert.Equal("Salário", criada.Descricao);
        Assert.Equal(2500.75m, criada.Valor);
        Assert.Equal(TipoTransacao.Receita, criada.Tipo);
    }

    [Fact]
    public async Task Post_ComMenorDeIdadeEReceita_Retorna422()
    {
        var menor = await CriarPessoaAsync("João", 17);

        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = menor.Id,
            descricao = "Mesada",
            valor = 50m,
            tipo = "Receita"
        });

        Assert.Equal(HttpStatusCode.UnprocessableEntity, response.StatusCode);

        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>(TestJsonOptions.Instance);
        Assert.NotNull(problem);
        Assert.Contains("Menores de 18 anos", problem.Detail ?? string.Empty);
    }

    [Fact]
    public async Task Post_ComMenorDeIdadeEDespesa_Retorna201()
    {
        var menor = await CriarPessoaAsync("João", 17);

        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = menor.Id,
            descricao = "Lanche",
            valor = 15m,
            tipo = "Despesa"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Post_ComPessoaInexistente_Retorna404()
    {
        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = 999,
            descricao = "Qualquer",
            valor = 10m,
            tipo = "Despesa"
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Post_ComValorZero_Retorna400()
    {
        var pessoa = await CriarPessoaAsync("Ana", 30);

        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "Inválida",
            valor = 0m,
            tipo = "Despesa"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Get_ListaTodasAsTransacoes()
    {
        var pessoa = await CriarPessoaAsync("Ana", 30);
        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "A",
            valor = 10m,
            tipo = "Despesa"
        });
        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "B",
            valor = 20m,
            tipo = "Receita"
        });

        var response = await _client.GetAsync("/api/transacoes");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var transacoes = await response.Content.ReadFromJsonAsync<List<TransacaoResponse>>(TestJsonOptions.Instance);
        Assert.NotNull(transacoes);
        Assert.Equal(2, transacoes.Count);
    }

    [Fact]
    public async Task Get_PorPessoa_RetornaApenasTransacoesDaPessoa()
    {
        var pessoa1 = await CriarPessoaAsync("Ana", 30);
        var pessoa2 = await CriarPessoaAsync("Bruno", 40);

        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa1.Id,
            descricao = "A",
            valor = 10m,
            tipo = "Despesa"
        });
        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa2.Id,
            descricao = "B",
            valor = 20m,
            tipo = "Receita"
        });

        var response = await _client.GetAsync($"/api/transacoes/pessoa/{pessoa1.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var transacoes = await response.Content.ReadFromJsonAsync<List<TransacaoResponse>>(TestJsonOptions.Instance);
        Assert.NotNull(transacoes);
        Assert.Single(transacoes);
        Assert.Equal(pessoa1.Id, transacoes[0].PessoaId);
    }

    [Fact]
    public async Task Get_PorPessoaInexistente_Retorna404()
    {
        var response = await _client.GetAsync("/api/transacoes/pessoa/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private async Task<PessoaResponse> CriarPessoaAsync(string nome, int idade)
    {
        var response = await _client.PostAsJsonAsync("/api/pessoas", new { nome, idade });
        response.EnsureSuccessStatusCode();
        var pessoa = await response.Content.ReadFromJsonAsync<PessoaResponse>(TestJsonOptions.Instance);
        return pessoa ?? throw new InvalidOperationException("Falha ao criar pessoa no setup do teste.");
    }
}
