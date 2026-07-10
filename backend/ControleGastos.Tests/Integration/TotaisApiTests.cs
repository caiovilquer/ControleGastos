using System.Net;
using System.Net.Http.Json;
using ControleGastos.Api.DTOs;
using ControleGastos.Tests.Helpers;

namespace ControleGastos.Tests.Integration;

public class TotaisApiTests : IClassFixture<ControleGastosWebApplicationFactory>, IAsyncLifetime
{
    private readonly ControleGastosWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public TotaisApiTests(ControleGastosWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync() => await _factory.ResetDatabaseAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Get_SemDados_RetornaTotaisZerados()
    {
        var response = await _client.GetAsync("/api/totais");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var totais = await response.Content.ReadFromJsonAsync<TotaisGeralResponse>(TestJsonOptions.Instance);
        Assert.NotNull(totais);
        Assert.Empty(totais.Pessoas);
        Assert.Equal(0m, totais.TotalReceitas);
        Assert.Equal(0m, totais.TotalDespesas);
        Assert.Equal(0m, totais.Saldo);
    }

    [Fact]
    public async Task Get_ComPessoasETransacoes_CalculaTotaisIndividuaisEGerais()
    {
        var pessoaA = await CriarPessoaAsync("Pessoa A", 30);
        var pessoaB = await CriarPessoaAsync("Pessoa B", 30);
        await CriarPessoaAsync("Pessoa C", 30);

        await CriarTransacaoAsync(pessoaA.Id, "Salário", 3000m, "Receita");
        await CriarTransacaoAsync(pessoaA.Id, "Aluguel", 1200m, "Despesa");
        await CriarTransacaoAsync(pessoaB.Id, "Mercado", 500m, "Despesa");
        await CriarTransacaoAsync(pessoaB.Id, "Conta", 300m, "Despesa");

        var response = await _client.GetAsync("/api/totais");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var totais = await response.Content.ReadFromJsonAsync<TotaisGeralResponse>(TestJsonOptions.Instance);
        Assert.NotNull(totais);
        Assert.Equal(3, totais.Pessoas.Count);

        var totaisA = totais.Pessoas.Single(p => p.Id == pessoaA.Id);
        Assert.Equal(3000m, totaisA.TotalReceitas);
        Assert.Equal(1200m, totaisA.TotalDespesas);
        Assert.Equal(1800m, totaisA.Saldo);

        var totaisB = totais.Pessoas.Single(p => p.Id == pessoaB.Id);
        Assert.Equal(0m, totaisB.TotalReceitas);
        Assert.Equal(800m, totaisB.TotalDespesas);
        Assert.Equal(-800m, totaisB.Saldo);

        var totaisC = totais.Pessoas.Single(p => p.Nome == "Pessoa C");
        Assert.Equal(0m, totaisC.TotalReceitas);
        Assert.Equal(0m, totaisC.TotalDespesas);
        Assert.Equal(0m, totaisC.Saldo);

        Assert.Equal(3000m, totais.TotalReceitas);
        Assert.Equal(2000m, totais.TotalDespesas);
        Assert.Equal(1000m, totais.Saldo);
    }

    [Fact]
    public async Task FluxoCompleto_CriarPessoasTransacoesConsultarTotaisEExcluir()
    {
        // Exercita o fluxo principal do desafio via HTTP, do cadastro à
        // consulta de totais e à exclusão em cascata.
        var adulta = await CriarPessoaAsync("Fernanda", 29);
        var menor = await CriarPessoaAsync("Pedro", 15);

        await CriarTransacaoAsync(adulta.Id, "Salário", 4000m, "Receita");
        await CriarTransacaoAsync(adulta.Id, "Aluguel", 1500m, "Despesa");
        await CriarTransacaoAsync(menor.Id, "Lanche", 20m, "Despesa");

        var receitaMenor = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId = menor.Id,
            descricao = "Mesada",
            valor = 50m,
            tipo = "Receita"
        });
        Assert.Equal(HttpStatusCode.UnprocessableEntity, receitaMenor.StatusCode);

        var totaisResponse = await _client.GetAsync("/api/totais");
        var totais = await totaisResponse.Content.ReadFromJsonAsync<TotaisGeralResponse>(TestJsonOptions.Instance);
        Assert.NotNull(totais);
        Assert.Equal(4000m, totais.TotalReceitas);
        Assert.Equal(1520m, totais.TotalDespesas);
        Assert.Equal(2480m, totais.Saldo);

        var deleteResponse = await _client.DeleteAsync($"/api/pessoas/{menor.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        totaisResponse = await _client.GetAsync("/api/totais");
        totais = await totaisResponse.Content.ReadFromJsonAsync<TotaisGeralResponse>(TestJsonOptions.Instance);
        Assert.NotNull(totais);
        Assert.Single(totais.Pessoas);
        Assert.Equal(4000m, totais.TotalReceitas);
        Assert.Equal(1500m, totais.TotalDespesas);
        Assert.Equal(2500m, totais.Saldo);
    }

    private async Task<PessoaResponse> CriarPessoaAsync(string nome, int idade)
    {
        var response = await _client.PostAsJsonAsync("/api/pessoas", new { nome, idade });
        response.EnsureSuccessStatusCode();
        var pessoa = await response.Content.ReadFromJsonAsync<PessoaResponse>(TestJsonOptions.Instance);
        return pessoa ?? throw new InvalidOperationException("Falha ao criar pessoa no setup do teste.");
    }

    private async Task CriarTransacaoAsync(int pessoaId, string descricao, decimal valor, string tipo)
    {
        var response = await _client.PostAsJsonAsync("/api/transacoes", new
        {
            pessoaId,
            descricao,
            valor,
            tipo
        });
        response.EnsureSuccessStatusCode();
    }
}
