using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public interface ITotaisService
{
    Task<TotaisGeralResponse> ObterTotaisAsync(CancellationToken cancellationToken);
}
