export function getErrorsFromAPI(obj: any): string[] {
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

export function getErrorsIdentity(obj: any): string[]{
  console.log('Viendo que trae obj', obj);
  let errorMessage: string[] = [];
  for (let i = 0; i < obj.error.length; i++) {
    const element = obj.error[i];
    errorMessage.push(element.description);
  }
  return errorMessage;

}
