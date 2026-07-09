using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _dbContext;

    public TransacaoService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken)
    {
        // Projeção direto para o DTO (em vez de Include) evita carregar a
        // entidade Pessoa inteira só para obter o nome.
        return await _dbContext.Transacoes
            .AsNoTracking()
            .Select(ParaResponse)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<TransacaoResponse>> ListarPorPessoaAsync(int pessoaId, CancellationToken cancellationToken)
    {
        // Distingue pessoa inexistente (404) de pessoa existente sem
        // transações (200 com lista vazia).
        var pessoaExiste = await _dbContext.Pessoas
            .AsNoTracking()
            .AnyAsync(p => p.Id == pessoaId, cancellationToken);

        if (!pessoaExiste)
        {
            throw new RecursoNaoEncontradoException($"Pessoa {pessoaId} não encontrada.");
        }

        return await _dbContext.Transacoes
            .AsNoTracking()
            .Where(t => t.PessoaId == pessoaId)
            .Select(ParaResponse)
            .ToListAsync(cancellationToken);
    }

    public async Task<TransacaoResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken)
    {
        var transacao = await _dbContext.Transacoes
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(ParaResponse)
            .FirstOrDefaultAsync(cancellationToken);

        return transacao ?? throw new RecursoNaoEncontradoException($"Transação com id {id} não encontrada.");
    }

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
            PessoaNome = pessoa.Nome,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo
        };
    }

    private static readonly System.Linq.Expressions.Expression<Func<Transacao, TransacaoResponse>> ParaResponse = t => new TransacaoResponse
    {
        Id = t.Id,
        PessoaId = t.PessoaId,
        PessoaNome = t.Pessoa!.Nome,
        Descricao = t.Descricao,
        Valor = t.Valor,
        Tipo = t.Tipo
    };
}
