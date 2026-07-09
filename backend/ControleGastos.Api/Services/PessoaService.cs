using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class PessoaService : IPessoaService
{
    private readonly AppDbContext _dbContext;

    public PessoaService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<PessoaResponse>> ListarAsync(CancellationToken cancellationToken)
    {
        // Consulta somente leitura: AsNoTracking evita o custo de rastrear
        // as entidades no change tracker.
        return await _dbContext.Pessoas
            .AsNoTracking()
            .Select(p => new PessoaResponse
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<PessoaResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken)
    {
        var pessoa = await _dbContext.Pessoas
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PessoaResponse
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .FirstOrDefaultAsync(cancellationToken);

        return pessoa ?? throw new RecursoNaoEncontradoException($"Pessoa com id {id} não encontrada.");
    }

    public async Task<PessoaResponse> CriarAsync(CriarPessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = new Pessoa
        {
            Nome = request.Nome,
            Idade = request.Idade
        };

        _dbContext.Pessoas.Add(pessoa);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new PessoaResponse
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };
    }

    public async Task ExcluirAsync(int id, CancellationToken cancellationToken)
    {
        var pessoa = await _dbContext.Pessoas.FindAsync(new object?[] { id }, cancellationToken);
        if (pessoa is null)
        {
            throw new RecursoNaoEncontradoException($"Pessoa com id {id} não encontrada.");
        }

        // Não é preciso remover as transações manualmente: o cascade delete
        // configurado em AppDbContext (OnDelete(DeleteBehavior.Cascade)) faz
        // o SQLite apagá-las junto com a pessoa — regra de negócio do desafio.
        _dbContext.Pessoas.Remove(pessoa);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
