package com.db.lib.models;

import com.db.lib.utils.CryptoUtil;
import com.db.lib.utils.PropertiesReader;

public class SQLConfig {
	
	public String serverName;
	public String databaseName;
	public String username;
	public String password;
	public int port;
	public String driverClassName;
	public int commandTimeout;
	
	public SQLConfig() throws Exception {
		PropertiesReader reader = new PropertiesReader("database.properties");
		
		this.serverName = reader.getProperty("server.name");
		this.databaseName = reader.getProperty("database.name");
		this.username = reader.getProperty("username");
		this.password = CryptoUtil.decrypt(reader.getProperty("password"));
		this.port = Integer.parseInt(reader.getProperty("port"));
		this.driverClassName = reader.getProperty("driver.class.name");
		this.commandTimeout = Integer.parseInt(reader.getProperty("command.timeout"));
	}

}
