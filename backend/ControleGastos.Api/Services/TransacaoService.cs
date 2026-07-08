using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public class TransacaoService : ITransacaoService
{
    public Task<IReadOnlyCollection<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<IReadOnlyCollection<TransacaoResponse>> ListarPorPessoaAsync(int pessoaId, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<TransacaoResponse?> ObterPorIdAsync(int id, CancellationToken cancellationToken)
        => throw new NotImplementedException();

    public Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken)
        => throw new NotImplementedException();
}
