export const formToObject = (form: HTMLFormElement) => {
  const fd = new FormData(form);
  return [...fd].reduce((obj, [key, value]) => {
    if (key in obj) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    } else {
      obj[key] = value;
    }
    return obj;
  }, {} as any);
}