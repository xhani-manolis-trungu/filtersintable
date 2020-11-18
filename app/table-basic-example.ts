import {
  Component,
  ViewChildren,
  OnInit,
  QueryList,
  ElementRef
} from "@angular/core";
import { forkJoin } from "rxjs";
import { MatInput } from "@angular/material/input";
import { DataService } from "./data.service";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: "table-basic-example",
  styleUrls: ["table-basic-example.css"],
  templateUrl: "table-basic-example.html"
})
export class TableBasicExample implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: "Hydrogen", weight: "1.0079", symbol: "H" },
    { position: 2, name: "Helium", weight: "4.0026", symbol: "He" },
    { position: 3, name: "Lithium", weight: "6.941", symbol: "Li" },
    { position: 4, name: "Beryllium", weight: "9.0122", symbol: "Be" },
    { position: 5, name: "Boron", weight: "10.811", symbol: "B" },
    { position: 6, name: "Carbon", weight: "12.0107", symbol: "C" },
    { position: 7, name: "Nitrogen", weight: "14.0067", symbol: "N" },
    { position: 8, name: "Oxygen", weight: "15.9994", symbol: "O" },
    { position: 9, name: "Fluorine", weight: "18.9984", symbol: "F" },
    { position: 10, name: "Neon", weight: "20.1797", symbol: "Ne" }
  ];

  SCHEMA: any[] = [
    { name: "position", head: "No.", fixed: false },
    { name: "name", head: "Name", fixed: false },
    { name: "weight", head: "Weigth", fixed: false },
    { name: "symbol", head: "Symbol", fixed: false }
  ];
  filterControl = new FormControl();
  displayedColumns: string[] = ["name", "weight", "symbol"];

  public searchForm: FormGroup;
  public name = "";
  public weight = "";
  public symbol = "";
  public dataSource = new MatTableDataSource([]);
  schema: any[];
  editRowId: number = -1;
  @ViewChildren(MatInput, { read: ElementRef }) inputs: QueryList<ElementRef>;
  constructor(private dataService: DataService) {}

  getFilterPredicate() {
    return (row: any, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split("$");
      const tableName = filterArray[0];
      const tableWeight = filterArray[1];
      const tableSymbol = filterArray[2];

      const matchFilter = [];

      // Fetch data from row
      const columnName = row.name;
      const columnWeight = row.weight;
      console.log(columnWeight);
      const columnSymbol = row.symbol === null ? "N/A" : row.symbol;

      // verify fetching data by our searching values
      const customFilterTN = columnName.toLowerCase().includes(tableName);
      const customFilterTW = columnWeight.toLowerCase().includes(tableWeight);
      const customFilterTS = columnSymbol.toLowerCase().includes(tableSymbol);

      // push boolean values into array
      matchFilter.push(customFilterTN);
      matchFilter.push(customFilterTW);
      matchFilter.push(customFilterTS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  applyFilter() {
    const tn = this.searchForm.get("name").value;
    const tw = this.searchForm.get("weight").value;
    const ts = this.searchForm.get("symbol").value;

    this.name = tn === null || tn === "" ? "" : tn;
    this.weight = tw === null || tw === "" ? "" : tw;
    this.symbol = ts === null || ts === "" ? "" : ts;

    // create string of our searching values and split if by '$'
    const filterValue = this.name + "$" + this.weight + "$" + this.symbol;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      name: new FormControl(""),
      weight: new FormControl(""),
      symbol: new FormControl("")
    });

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.schema = this.SCHEMA;
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
