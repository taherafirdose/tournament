import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from './tournament.model';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from './user.model';

const PROTOCOL = 'https';
const PORT = 3500;

@Injectable()
export class RestDataSource
{
  user: User | null;
  baseUrl: string;
  baseUrl1: string;
  authToken!: string;

  private httpOptions =
  {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };
 
  constructor(private http: HttpClient,
              private jwtService: JwtHelperService)
  {
    this.user = new User();
    this.baseUrl1 = `https://comp229-f2020-week10.herokuapp.com/api/`;
    // this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/api/`;
     this.baseUrl = `https://60c59b75ec8ef800175e13f3.mockapi.io/tournament/`;
  }


  getTournaments(): Observable<Tournament[]>
  {
    return this.http.get<Tournament[]>(this.baseUrl + '');
  }

  addTournaments(tour: Tournament): Observable<Tournament>
  {
    this.loadToken();
    return this.http.post<Tournament>(this.baseUrl + '', tour, this.httpOptions);
  }
  
  deleteTournament(id: Object): Observable<Tournament>
  {
    this.loadToken();
    console.log(id);
    return this.http.delete(this.baseUrl+'/'+id);
  }

  modifyTour(tour: Tournament,id: Object): Observable<Tournament>
  {
    this.loadToken();
   return this.http.put<Tournament>(this.baseUrl+'/'+id, tour, this.httpOptions);

  }
  updateTournament(tour: Tournament): Observable<Tournament>
  {
    this.loadToken();
    return this.http.post<Tournament>(`${this.baseUrl}edit/${tour._id}`, tour, this.httpOptions);
  }

  authenticate(user: User): Observable<any>
  {
    return this.http.post<any>(this.baseUrl1 + 'login', user, this.httpOptions);
  }

  storeUserData(token: any, user: User): void
  {
    localStorage.setItem('id_token', 'Bearer ' + token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout(): Observable<any>
  {
    this.authToken = null || '';
    this.user = null;
    localStorage.clear();

    return this.http.get<any>(this.baseUrl + 'logout', this.httpOptions);
  }

  loggedIn(): boolean
  {
    return !this.jwtService.isTokenExpired(this.authToken);
  }

  private loadToken(): void
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token || '';
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.authToken);
  }
}

