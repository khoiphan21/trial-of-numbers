interface ObjectWithNameOrTitle {
  name?: string;
  title?: string;
}

export function getName(object: ObjectWithNameOrTitle): string {
  if (object.name) {
    return object['name'];
  } else if (object.title) {
    return object['title'];
  } else {
    return '';
  }
}
