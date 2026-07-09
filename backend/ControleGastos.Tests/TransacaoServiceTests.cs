using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using ControleGastos.Api.Models;
using ControleGastos.Api.Services;
using ControleGastos.Tests.Helpers;

namespace ControleGastos.Tests;

public class TransacaoServiceTests : IDisposable
{
    private readonly TestDbContextFactory _factory;
    private readonly TransacaoService _service;

    public TransacaoServiceTests()
    {
        _factory = new TestDbContextFactory();
        _service = new TransacaoService(_factory.DbContext);
    }

    [Theory]
    [InlineData(17, TipoTransacao.Despesa)]
    [InlineData(18, TipoTransacao.Receita)]
    [InlineData(18, TipoTransacao.Despesa)]
    public async Task CriarAsync_ComCombinacaoPermitidaDeIdadeETipo_CriaComSucesso(int idade, TipoTransacao tipo)
    {
        var pessoa = await CriarPessoaNoBancoAsync(idade);
        var request = new CriarTransacaoRequest
        {
            PessoaId = pessoa.Id,
            Descricao = "Transação",
            Valor = 100m,
            Tipo = tipo
        };

        var resultado = await _service.CriarAsync(request, CancellationToken.None);

        Assert.True(resultado.Id > 0);
        Assert.Equal(tipo, resultado.Tipo);
    }

    [Fact]
    public async Task CriarAsync_ComPessoaMenorDeIdadeEReceita_LancaRegraDeNegocioException()
    {
        var pessoa = await CriarPessoaNoBancoAsync(17);
        var request = new CriarTransacaoRequest
        {
            PessoaId = pessoa.Id,
            Descricao = "Mesada",
            Valor = 50m,
            Tipo = TipoTransacao.Receita
        };

        await Assert.ThrowsAsync<RegraDeNegocioException>(
            () => _service.CriarAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task CriarAsync_ComPessoaIdInexistente_LancaRecursoNaoEncontradoException()
    {
        var request = new CriarTransacaoRequest
        {
            PessoaId = 999,
            Descricao = "Transação",
            Valor = 100m,
            Tipo = TipoTransacao.Despesa
        };

        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(
            () => _service.CriarAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task CriarAsync_ComDadosValidos_PersisteEPermiteLerDeVoltaComOsMesmosDados()
    {
        var pessoa = await CriarPessoaNoBancoAsync(30);
        var request = new CriarTransacaoRequest
        {
            PessoaId = pessoa.Id,
            Descricao = "Salário",
            Valor = 2500.75m,
            Tipo = TipoTransacao.Receita
        };

        var criada = await _service.CriarAsync(request, CancellationToken.None);
        var lida = await _service.ObterPorIdAsync(criada.Id, CancellationToken.None);

        Assert.Equal(criada.Id, lida.Id);
        Assert.Equal(pessoa.Id, lida.PessoaId);
        Assert.Equal("Salário", lida.Descricao);
        Assert.Equal(2500.75m, lida.Valor);
        Assert.Equal(TipoTransacao.Receita, lida.Tipo);
    }

    [Fact]
    public async Task ListarAsync_ComTransacoesDeMultiplasPessoas_RetornaTodas()
    {
        var pessoa1 = await CriarPessoaNoBancoAsync(30);
        var pessoa2 = await CriarPessoaNoBancoAsync(40);

        await _service.CriarAsync(new CriarTransacaoRequest { PessoaId = pessoa1.Id, Descricao = "A", Valor = 10m, Tipo = TipoTransacao.Despesa }, CancellationToken.None);
        await _service.CriarAsync(new CriarTransacaoRequest { PessoaId = pessoa2.Id, Descricao = "B", Valor = 20m, Tipo = TipoTransacao.Receita }, CancellationToken.None);

        var todas = await _service.ListarAsync(CancellationToken.None);

        Assert.Equal(2, todas.Count);
    }

    [Fact]
    public async Task ListarPorPessoaAsync_ComPessoaComTransacoes_RetornaApenasAsDaquelaPessoa()
    {
        var pessoa1 = await CriarPessoaNoBancoAsync(30);
        var pessoa2 = await CriarPessoaNoBancoAsync(40);

        await _service.CriarAsync(new CriarTransacaoRequest { PessoaId = pessoa1.Id, Descricao = "A", Valor = 10m, Tipo = TipoTransacao.Despesa }, CancellationToken.None);
        await _service.CriarAsync(new CriarTransacaoRequest { PessoaId = pessoa2.Id, Descricao = "B", Valor = 20m, Tipo = TipoTransacao.Receita }, CancellationToken.None);

        var daPessoa1 = await _service.ListarPorPessoaAsync(pessoa1.Id, CancellationToken.None);

        Assert.Single(daPessoa1);
        Assert.Equal(pessoa1.Id, daPessoa1.Single().PessoaId);
    }

    [Fact]
    public async Task ListarPorPessoaAsync_ComPessoaSemTransacoes_RetornaListaVazia()
    {
        var pessoa = await CriarPessoaNoBancoAsync(30);

        var resultado = await _service.ListarPorPessoaAsync(pessoa.Id, CancellationToken.None);

        Assert.Empty(resultado);
    }

    [Fact]
    public async Task ListarPorPessoaAsync_ComPessoaIdInexistente_LancaRecursoNaoEncontradoException()
    {
        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(
            () => _service.ListarPorPessoaAsync(999, CancellationToken.None));
    }

    private async Task<Pessoa> CriarPessoaNoBancoAsync(int idade)
    {
        var pessoa = TestDataBuilder.CriarPessoa(idade: idade);
        _factory.DbContext.Pessoas.Add(pessoa);
        await _factory.DbContext.SaveChangesAsync();
        return pessoa;
    }

    public void Dispose() => _factory.Dispose();
}
