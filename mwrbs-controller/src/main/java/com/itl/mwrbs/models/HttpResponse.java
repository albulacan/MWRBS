package com.itl.mwrbs.models;

public class HttpResponse<T> {
	
	private T body;
	private boolean isSuccess;
	private String message;
	
	public HttpResponse() {
	}
	
	private HttpResponse(T body, boolean isSuccess, String message) {
		this.body = body;
		this.isSuccess = isSuccess;
		this.message = message;
	}
	
	public static <T> HttpResponse<T> success(T body) {
		return new HttpResponse<T>(body, true, "SUCCESS");
	}
	
	public static <T> HttpResponse<T> success() {
		return new HttpResponse<T>(null, true, "SUCCESS");
	}
	
	public static <T> HttpResponse<T> success(String message) {
		return new HttpResponse<T>(null, true, message);
	}
	
	public static <T> HttpResponse<T> failed(String message) {
		message = message.replace("SPCERR:", "");
		return new HttpResponse<T>(null, false, message);
	}
	
	public static <T> HttpResponse<T> failed(T body, String message) {
		return new HttpResponse<T>(body, false, message);
	}
	
	public T getBody() {
		return body;
	}
	public void setBody(T body) {
		this.body = body;
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
