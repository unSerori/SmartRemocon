import { ValidationError } from '@nestjs/common';

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      const constraints = Object.values(error.constraints ?? {}).join(', ');
      return `${error.property}: ${constraints}`;
    })
    .join('; ');

  // 構造化する場合以下のような形で実装する
  // return JSON.stringify(
  //   Object.fromEntries(
  //     errors.map((error) => [error.property, Object.values(error.constraints ?? {})]),
  //   ),
  // );
}
