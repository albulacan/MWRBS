package com.db.lib.models;

public class SQLResult<T> {

	private T object;
	private boolean isSuccess;
	private String message;
	
	public SQLResult() {
	}
	
	public SQLResult(boolean isSuccess) {
		this.isSuccess = isSuccess;
		this.message = "";
	}
	
	public SQLResult(T object) {
		this.isSuccess = true;
		this.object = object;
		this.message = "";
	}
	
	public SQLResult(String message) {
		this.isSuccess = false;
		this.message = message;
	}
	
	public T getObject() {
		return object;
	}
	public void setObject(T object) {
		this.object = object;
	}
	public boolean isSuccess() {
		return isSuccess;
	}
	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	
}
