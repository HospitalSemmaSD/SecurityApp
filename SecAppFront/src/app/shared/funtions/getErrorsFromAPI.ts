export function getErgetErrorsFromAPI(obj: any): string[] {
  const error = obj.error.errors;
  let messagesErrors: string[] = [];

  for (let key in error) {
    let field = key;
    const messageWithField = error[key].map(
      (message: string) => `${field}: ${message}`
    );
    messagesErrors = messagesErrors.concat(messageWithField);
  }
  return messagesErrors;
}
