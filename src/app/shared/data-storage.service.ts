import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  myUrl = 'https://ng-guide-d3833-default-rtdb.firebaseio.com/'
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        `${this.myUrl}recipes.json`,
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes(){
      return this.http
      .get<Recipe[]>(
        `${this.myUrl}recipes.json`,
        // {
        //   params : new HttpParams().set('auth', user.token)
        // }
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      )
  }



}
