# MWRS-and-BS (MWRBS)

### Web Application Project

* Front-end: Angular 10
* Backend: Java 12 with Spring Boot Framework
* Database: MS SQL Server

### Guidelines:
1. Front End - use the following VS Code extentions
    * Angular Language Service
    * TSLint
2. For backend, use "com.itl.mwrbs" as package name of the project
3. Table Prefixes
    * R_ means data is default and read only
    * I_ means insert only
    * T_ means insert, update and delete is allowed
4. Stored Procedures
    * Always start the sp name with usp_mwrbs_
    * Dont forget to add Author and date creation
    * Use Get for select and Set for insert and Save for insert or update
    * Sample - usp_mwrbs_InsertClientInformation
