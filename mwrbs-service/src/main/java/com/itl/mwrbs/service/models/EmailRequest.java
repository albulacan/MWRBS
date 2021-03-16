package com.itl.mwrbs.service.models;

public class EmailRequest {
	
	private String recipients;
	private String cCopy;
	private String subject;
	private String body;
	
	public String getcCopy() {
		return cCopy;
	}
	public void setcCopy(String cCopy) {
		this.cCopy = cCopy;
	}
	public String getRecipients() {
		return recipients;
	}
	public void setRecipients(String recipients) {
		this.recipients = recipients;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
}
