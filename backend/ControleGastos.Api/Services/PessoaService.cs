using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;

namespace ControleGastos.Api.Services;

public class PessoaService : IPessoaService
{
    private readonly AppDbContext _dbContext;

    public PessoaService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<IReadOnlyCollection<PessoaResponse>> ListarAsync(CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<PessoaResponse?> ObterPorIdAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();

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

    public Task<bool> ExcluirAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();
}
