using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public class TotaisService : ITotaisService
{
    public Task<TotaisGeralResponse> ObterTotaisAsync(CancellationToken cancellationToken)
        => throw new NotImplementedException();
}
