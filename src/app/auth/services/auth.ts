import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, of, switchMap} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface CreatedUserResponse {
  id: string;
  // Add other fields if necessary
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloakUrl = '/host/realms/test/protocol/openid-connect';
  private clientId = 'front-angular'; // Ensure this matches your Keycloak client ID

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', this.clientId);
    body.set('username', credentials.username);
    body.set('password', credentials.password);
    body.set('scope', 'openid');

    return this.http.post(`${this.keycloakUrl}/token`, body.toString(), { headers }).pipe(
      tap((tokens: any) => {
        this.storeTokens(tokens);
        this.router.navigate(['/']); // Redirect to home or dashboard after login
      }),
      catchError(error => {
        console.error('Login failed:', error);
        // Handle login error, e.g., display a message to the user
        return of(null);
      })
    );
  }

  getAdminToken(): Observable<string | null> {
    const tokenUrl = '/host/realms/master/protocol/openid-connect/token';
    const body = new URLSearchParams();
    body.set('client_id', 'admin-cli');
    body.set('username', 'delmas');
    body.set('password', 'delmasbrou');
    body.set('grant_type', 'password');
    body.set('scope', 'openid');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(tokenUrl, body.toString(), { headers }).pipe(
      map(response => response.access_token),
      catchError(error => {
        console.error('Token retrieval failed:', error);
        return of(null);
      })
    );
  }



  register(user: { preferred_username: string, email: string, password: string, roleName: string }): Observable<any> {
    return this.getAdminToken().pipe(
      switchMap(adminToken => {
        if (!adminToken) {
          console.error('Impossible d\'obtenir le token administrateur');
          return of(null);
        }

        const registrationApiUrl = '/host/admin/realms/test/users';

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        });

        const userPayload = {
          username: user.preferred_username,
          email: user.email,
          enabled: true,
          credentials: [{
            type: 'password',
            value: user.password,
            temporary: false
          }]
        };

        return this.http.post(registrationApiUrl, userPayload, { headers }).pipe(
          switchMap(() => {
            // Une fois l'utilisateur créé, on essaie de récupérer l'utilisateur par son nom d'utilisateur
            const getUserUrl = `/host/admin/realms/test/users?username=${user.preferred_username}`;

            return this.http.get<any[]>(getUserUrl, { headers }).pipe(
              switchMap(users => {
                if (users && users.length > 0) {
                  const userId = users[0].id; // On suppose que le premier utilisateur trouvé est celui créé
                  const assignRoleUrl = `/host/admin/realms/test/users/${userId}/role-mappings/realm`;

                  const rolePayload = [
                    { name: user.roleName }
                  ];

                  const roleHeaders = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                  });

                  return this.http.post(assignRoleUrl, rolePayload, { headers: roleHeaders }).pipe(
                    tap(() => {
                      console.log('Utilisateur enregistré et rôle attribué avec succès');
                      this.router.navigate(['/login']);
                    }),
                    catchError(roleError => {
                      console.error('Échec de l\'attribution du rôle:', roleError);
                      return of(null);
                    })
                  );
                } else {
                  console.error('Utilisateur non trouvé après création');
                  return of(null);
                }
              }),
              catchError(getUserError => {
                console.error('Erreur lors de la récupération de l\'utilisateur:', getUserError);
                return of(null);
              })
            );
          }),
          catchError(error => {
            console.error('Échec de l\'enregistrement:', error);
            return of(null);
          })
        );
      })
    );
  }



  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private storeTokens(tokens: any): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
}
