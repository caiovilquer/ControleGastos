using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly ITotaisService _totaisService;

    public TotaisController(ITotaisService totaisService)
    {
        _totaisService = totaisService;
    }

    [HttpGet]
    public async Task<ActionResult<TotaisGeralResponse>> Obter(CancellationToken cancellationToken)
    {
        var totais = await _totaisService.ObterTotaisAsync(cancellationToken);
        return Ok(totais);
    }
}
