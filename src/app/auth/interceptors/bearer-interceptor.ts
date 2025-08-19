import { HttpInterceptorFn } from '@angular/common/http';

export const bearerInterceptor: HttpInterceptorFn = (req, next) => {
  // const paths = ['/customers','/accounts'];
  const paths = ['/qqq'];

  if (paths.some(path => req.url.includes(path))) {
    let reqUrl = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
    });
    return next(reqUrl);
  }
  return next(req);


};
