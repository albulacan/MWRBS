package com.itl.mwrbs.models;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class ReservationPayment {
	
	private long reservationPaymentId;
	private long paymentTypeId;
	private String paymentTypeName;
	private long reservationId;
	private String referenceNumber;
	private String accountNumber;
	private String accountName;
	private BigDecimal amount;
	private String file;
	private String attachmentPath;
	private Timestamp createdOn;
	private int totalRecords;
	private Timestamp dateFrom;
	private Timestamp dateTo;

	public long getReservationPaymentId() {
		return reservationPaymentId;
	}
	public void setReservationPaymentId(long reservationPaymentId) {
		this.reservationPaymentId = reservationPaymentId;
	}
	public long getPaymentTypeId() {
		return paymentTypeId;
	}
	public void setPaymentTypeId(long paymentTypeId) {
		this.paymentTypeId = paymentTypeId;
	}
	public String getPaymentTypeName() {
		return paymentTypeName;
	}
	public void setPaymentTypeName(String paymentTypeName) {
		this.paymentTypeName = paymentTypeName;
	}
	public long getReservationId() {
		return reservationId;
	}
	public void setReservationId(long reservationId) {
		this.reservationId = reservationId;
	}
	public String getReferenceNumber() {
		return referenceNumber;
	}
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	public String getAccountNumber() {
		return accountNumber;
	}
	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
	}
	public String getAttachmentPath() {
		return attachmentPath;
	}
	public void setAttachmentPath(String attachmentPath) {
		this.attachmentPath = attachmentPath;
	}
	public Timestamp getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}
	public int getTotalRecords() {
		return totalRecords;
	}
	public void setTotalRecords(int totalRecords) {
		this.totalRecords = totalRecords;
	}
	public Timestamp getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(Timestamp dateFrom) {
		this.dateFrom = dateFrom;
	}
	public Timestamp getDateTo() {
		return dateTo;
	}
	public void setDateTo(Timestamp dateTo) {
		this.dateTo = dateTo;
	}
	
}
