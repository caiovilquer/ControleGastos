using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using ControleGastos.Api.Models;
using ControleGastos.Api.Services;
using ControleGastos.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Tests;

public class PessoaServiceTests : IDisposable
{
    private readonly TestDbContextFactory _factory;
    private readonly PessoaService _service;

    public PessoaServiceTests()
    {
        _factory = new TestDbContextFactory();
        _service = new PessoaService(_factory.DbContext);
    }

    [Fact]
    public async Task CriarAsync_DevePermitirLerAPessoaDeVoltaComObterPorId()
    {
        var request = new CriarPessoaRequest { Nome = "Ana", Idade = 25 };

        var criada = await _service.CriarAsync(request, CancellationToken.None);
        var lida = await _service.ObterPorIdAsync(criada.Id, CancellationToken.None);

        Assert.Equal(criada.Id, lida.Id);
        Assert.Equal("Ana", lida.Nome);
        Assert.Equal(25, lida.Idade);
    }

    [Fact]
    public async Task ObterPorIdAsync_ComIdInexistente_LancaRecursoNaoEncontradoException()
    {
        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(
            () => _service.ObterPorIdAsync(999, CancellationToken.None));
    }

    [Fact]
    public async Task ExcluirAsync_ComIdInexistente_LancaRecursoNaoEncontradoException()
    {
        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(
            () => _service.ExcluirAsync(999, CancellationToken.None));
    }

    // Verifica cascade delete no DbContext (não via DTO).
    [Fact]
    public async Task ExcluirAsync_DeveRemoverTodasAsTransacoesVinculadas_QuandoPessoaEExcluida()
    {
        var dbContext = _factory.DbContext;

        var pessoa = TestDataBuilder.CriarPessoa("Ana", 25);
        dbContext.Pessoas.Add(pessoa);
        await dbContext.SaveChangesAsync();

        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Salário", 1000m, TipoTransacao.Receita));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Aluguel", 500m, TipoTransacao.Despesa));
        await dbContext.SaveChangesAsync();

        Assert.Equal(2, await dbContext.Transacoes.CountAsync(t => t.PessoaId == pessoa.Id));

        await _service.ExcluirAsync(pessoa.Id, CancellationToken.None);

        Assert.False(await dbContext.Transacoes.AnyAsync(t => t.PessoaId == pessoa.Id));
        Assert.Equal(0, await dbContext.Pessoas.CountAsync());
    }

    [Fact]
    public async Task ExcluirAsync_ComOutraPessoaTendoTransacoes_NaoAfetaAsTransacoesDaOutraPessoa()
    {
        var dbContext = _factory.DbContext;

        var pessoaExcluida = TestDataBuilder.CriarPessoa("Ana", 25);
        var pessoaMantida = TestDataBuilder.CriarPessoa("Bruno", 30);
        dbContext.Pessoas.AddRange(pessoaExcluida, pessoaMantida);
        await dbContext.SaveChangesAsync();

        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaExcluida.Id, "Salário", 1000m, TipoTransacao.Receita));
        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoaMantida.Id, "Mercado", 200m, TipoTransacao.Despesa));
        await dbContext.SaveChangesAsync();

        await _service.ExcluirAsync(pessoaExcluida.Id, CancellationToken.None);

        Assert.Equal(1, await dbContext.Transacoes.CountAsync());
        Assert.True(await dbContext.Transacoes.AnyAsync(t => t.PessoaId == pessoaMantida.Id));
    }

    public void Dispose() => _factory.Dispose();
}
