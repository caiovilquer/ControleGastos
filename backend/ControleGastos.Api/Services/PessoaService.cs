using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public class PessoaService : IPessoaService
{
    public Task<IReadOnlyCollection<PessoaResponse>> ListarAsync(CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<PessoaResponse?> ObterPorIdAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<PessoaResponse> CriarAsync(CriarPessoaRequest request, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<bool> ExcluirAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();
}
