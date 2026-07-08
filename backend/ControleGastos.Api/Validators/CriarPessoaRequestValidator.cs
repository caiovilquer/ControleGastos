using ControleGastos.Api.DTOs;
using FluentValidation;

namespace ControleGastos.Api.Validators;

// Apenas validação de formato. Regras de negócio (ex.: restrição de
// transações para menores de idade) ficam nos services, não aqui.
public class CriarPessoaRequestValidator : AbstractValidator<CriarPessoaRequest>
{
    public CriarPessoaRequestValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Idade)
            .GreaterThanOrEqualTo(0);
    }
}
