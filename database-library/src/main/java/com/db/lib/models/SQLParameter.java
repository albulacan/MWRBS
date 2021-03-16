package com.db.lib.models;

import java.sql.JDBCType;

public class SQLParameter {
	
	public String name;
	public Object value;
	public JDBCType type;
	public ParameterDirection direction;
	
	public SQLParameter(String name, Object value, JDBCType type, ParameterDirection direction) {
		this.name = name;
		this.value = value;
		this.type = type;
		this.direction = direction;
	}

}
