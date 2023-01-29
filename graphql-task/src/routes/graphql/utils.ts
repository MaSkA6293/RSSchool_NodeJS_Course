export const getUpdateObject = (obj: any): any => {
  let update = {};

  Object.keys(obj)
    .filter((field) => field !== 'id')
    .forEach((fieldName) => {
      update = { ...update, [fieldName]: obj[fieldName] };
    });

  return update;
};
