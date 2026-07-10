using System.Net;
using System.Net.Http.Json;
using ControleGastos.Api.DTOs;
using ControleGastos.Tests.Helpers;

namespace ControleGastos.Tests.Integration;

public class PessoasApiTests : IClassFixture<ControleGastosWebApplicationFactory>, IAsyncLifetime
{
    private readonly ControleGastosWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public PessoasApiTests(ControleGastosWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // IClassFixture compartilha o SQLite :memory:; limpa antes de cada teste.
    public async Task InitializeAsync() => await _factory.ResetDatabaseAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Post_ComDadosValidos_Retorna201EPermiteLerDeVolta()
    {
        var response = await _client.PostAsJsonAsync("/api/pessoas", new { nome = "Ana", idade = 25 });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var criada = await response.Content.ReadFromJsonAsync<PessoaResponse>(TestJsonOptions.Instance);
        Assert.NotNull(criada);
        Assert.True(criada.Id > 0);
        Assert.Equal("Ana", criada.Nome);
        Assert.Equal(25, criada.Idade);
        Assert.NotNull(response.Headers.Location);

        var obter = await _client.GetAsync($"/api/pessoas/{criada.Id}");
        Assert.Equal(HttpStatusCode.OK, obter.StatusCode);

        var lida = await obter.Content.ReadFromJsonAsync<PessoaResponse>(TestJsonOptions.Instance);
        Assert.NotNull(lida);
        Assert.Equal(criada.Id, lida.Id);
        Assert.Equal("Ana", lida.Nome);
    }

    [Fact]
    public async Task Get_ListaPessoasCriadas()
    {
        await _client.PostAsJsonAsync("/api/pessoas", new { nome = "Ana", idade = 25 });
        await _client.PostAsJsonAsync("/api/pessoas", new { nome = "Bruno", idade = 30 });

        var response = await _client.GetAsync("/api/pessoas");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var pessoas = await response.Content.ReadFromJsonAsync<List<PessoaResponse>>(TestJsonOptions.Instance);
        Assert.NotNull(pessoas);
        Assert.Equal(2, pessoas.Count);
    }

    [Fact]
    public async Task Get_ComIdInexistente_Retorna404()
    {
        var response = await _client.GetAsync("/api/pessoas/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Post_ComNomeVazio_Retorna400()
    {
        var response = await _client.PostAsJsonAsync("/api/pessoas", new { nome = "", idade = 25 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Delete_RemovePessoaESuasTransacoes_Retorna204()
    {
        var pessoaResponse = await _client.PostAsJsonAsync("/api/pessoas", new { nome = "Ana", idade = 25 });
        var pessoa = await pessoaResponse.Content.ReadFromJsonAsync<PessoaResponse>(TestJsonOptions.Instance);
        Assert.NotNull(pessoa);

        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "Salário",
            valor = 1000m,
            tipo = "Receita"
        });
        await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = pessoa.Id,
            descricao = "Aluguel",
            valor = 500m,
            tipo = "Despesa"
        });

        var deleteResponse = await _client.DeleteAsync($"/api/pessoas/{pessoa.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var obterPessoa = await _client.GetAsync($"/api/pessoas/{pessoa.Id}");
        Assert.Equal(HttpStatusCode.NotFound, obterPessoa.StatusCode);

        var transacoesResponse = await _client.GetAsync("/api/transacoes");
        var transacoes = await transacoesResponse.Content.ReadFromJsonAsync<List<TransacaoResponse>>(TestJsonOptions.Instance);
        Assert.NotNull(transacoes);
        Assert.Empty(transacoes);
    }

    [Fact]
    public async Task Delete_ComIdInexistente_Retorna404()
    {
        var response = await _client.DeleteAsync("/api/pessoas/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
