using ControleGastos.Api.Models;
using ControleGastos.Api.Services;
using ControleGastos.Tests.Helpers;

namespace ControleGastos.Tests;

public class TotaisServiceTests : IDisposable
{
    private readonly TestDbContextFactory _factory;
    private readonly TotaisService _service;

    public TotaisServiceTests()
    {
        _factory = new TestDbContextFactory();
        _service = new TotaisService(_factory.DbContext);
    }

    [Fact]
    public async Task ObterTotaisAsync_ComPessoasComESemTransacoes_CalculaTotaisIndividuaisEGerais()
    {
        var dbContext = _factory.DbContext;

        var pessoaA = TestDataBuilder.CriarPessoa("Pessoa A", 30);
        var pessoaB = TestDataBuilder.CriarPessoa("Pessoa B", 30);
        var pessoaC = TestDataBuilder.CriarPessoa("Pessoa C", 30);
        dbContext.Pessoas.AddRange(pessoaA, pessoaB, pessoaC);
        await dbContext.SaveChangesAsync();

        // Pessoa A: receitas e despesas -> saldo positivo.
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaA.Id, "Salário", 3000m, TipoTransacao.Receita));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaA.Id, "Aluguel", 1200m, TipoTransacao.Despesa));

        // Pessoa B: só despesas -> saldo negativo.
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaB.Id, "Mercado", 500m, TipoTransacao.Despesa));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaB.Id, "Conta", 300m, TipoTransacao.Despesa));

        // Pessoa C: sem transações -> totais zerados.
        await dbContext.SaveChangesAsync();

        var totais = await _service.ObterTotaisAsync(CancellationToken.None);

        Assert.Equal(3, totais.Pessoas.Count);

        var totaisA = totais.Pessoas.Single(p => p.Id == pessoaA.Id);
        Assert.Equal(3000m, totaisA.TotalReceitas);
        Assert.Equal(1200m, totaisA.TotalDespesas);
        Assert.Equal(1800m, totaisA.Saldo);

        var totaisB = totais.Pessoas.Single(p => p.Id == pessoaB.Id);
        Assert.Equal(0m, totaisB.TotalReceitas);
        Assert.Equal(800m, totaisB.TotalDespesas);
        Assert.Equal(-800m, totaisB.Saldo);

        var totaisC = totais.Pessoas.Single(p => p.Id == pessoaC.Id);
        Assert.Equal(0m, totaisC.TotalReceitas);
        Assert.Equal(0m, totaisC.TotalDespesas);
        Assert.Equal(0m, totaisC.Saldo);

        Assert.Equal(3000m, totais.TotalReceitas);
        Assert.Equal(2000m, totais.TotalDespesas);
        Assert.Equal(1000m, totais.Saldo);
    }

    [Fact]
    public async Task ObterTotaisAsync_SemPessoasCadastradas_RetornaListaVaziaETotaisGeraisZerados()
    {
        var totais = await _service.ObterTotaisAsync(CancellationToken.None);

        Assert.Empty(totais.Pessoas);
        Assert.Equal(0m, totais.TotalReceitas);
        Assert.Equal(0m, totais.TotalDespesas);
        Assert.Equal(0m, totais.Saldo);
    }

    [Fact]
    public async Task ObterTotaisAsync_ComValoresDecimaisComCentavos_SomaExataSemPerdaDePrecisao()
    {
        var dbContext = _factory.DbContext;

        var pessoa = TestDataBuilder.CriarPessoa("Pessoa Decimal", 30);
        dbContext.Pessoas.Add(pessoa);
        await dbContext.SaveChangesAsync();

        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Receita 1", 10.50m, TipoTransacao.Receita));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Receita 2", 0.99m, TipoTransacao.Receita));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Despesa 1", 0.49m, TipoTransacao.Despesa));
        await dbContext.SaveChangesAsync();

        var totais = await _service.ObterTotaisAsync(CancellationToken.None);
        var totaisPessoa = totais.Pessoas.Single();

        // decimal deve bater exato: sem tolerância de ponto flutuante.
        Assert.Equal(11.49m, totaisPessoa.TotalReceitas);
        Assert.Equal(0.49m, totaisPessoa.TotalDespesas);
        Assert.Equal(11.00m, totaisPessoa.Saldo);

        Assert.Equal(11.49m, totais.TotalReceitas);
        Assert.Equal(0.49m, totais.TotalDespesas);
        Assert.Equal(11.00m, totais.Saldo);
    }

    public void Dispose() => _factory.Dispose();
}
