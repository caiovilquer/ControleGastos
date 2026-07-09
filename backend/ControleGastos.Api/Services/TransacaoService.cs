using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using ControleGastos.Api.Models;

namespace ControleGastos.Api.Services;

public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _dbContext;

    public TransacaoService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<IReadOnlyCollection<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<IReadOnlyCollection<TransacaoResponse>> ListarPorPessoaAsync(int pessoaId, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<TransacaoResponse?> ObterPorIdAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public async Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken)
    {
        // Regra do desafio: o identificador da pessoa precisa existir
        // previamente no cadastro.
        var pessoa = await _dbContext.Pessoas.FindAsync(new object?[] { request.PessoaId }, cancellationToken)
            ?? throw new RecursoNaoEncontradoException($"Pessoa {request.PessoaId} não encontrada.");

        // Regra do desafio: menores de idade só podem cadastrar despesas.
        // A comparação é estritamente "< 18": aos 18 anos exatos a pessoa já
        // pode cadastrar receitas.
        if (pessoa.Idade < 18 && request.Tipo == TipoTransacao.Receita)
        {
            throw new RegraDeNegocioException("Menores de 18 anos só podem cadastrar despesas.");
        }

        var transacao = new Transacao
        {
            PessoaId = request.PessoaId,
            Descricao = request.Descricao,
            Valor = request.Valor,
            Tipo = request.Tipo
        };

        _dbContext.Transacoes.Add(transacao);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new TransacaoResponse
        {
            Id = transacao.Id,
            PessoaId = transacao.PessoaId,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo
        };
    }
}
