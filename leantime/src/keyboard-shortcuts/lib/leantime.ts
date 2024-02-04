export const getProject = () => {
  const url =
    document.getElementById('projectUrl')?.value ||
    document.querySelector('.projectLineItem.active a')?.href;
  if (url) {
    return {
      url,
      id: url.replace(/^.+\/([^/]+)$/, '$1'),
    };
  }

  return false;
};

export const getToDo = () => {
  const url = document.querySelector('#ticketdetails form')?.action;
  if (url) {
    return {
      url: location.href,
      id: url.replace(/^.+\/([^/]+)$/, '$1'),
    };
  }

  return false;
};
