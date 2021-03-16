package com.itl.mwrbs.service.models;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class EmailNotificationRequest {
	
	private long emailTypeId;
	private String referenceNumber;
	private String firstName;
	private String middleName;
	private String lastName;
	private String address;
	private String contactNumber;
	private String emailAddress;
	private long roomTypeId;
	private String roomTypeName;
	private String roomName;
	private Timestamp checkInDate;
	private Timestamp checkOutDate;
	private int noOfGuest;
	private int additionalGuest;
	private int additionalMattress;
	private BigDecimal totalAmountDue;
	private long reservationStatusId;
	private long statusId;
	private String statusName;
	private String modifiedBy;
	private Timestamp createdOn;
	private Timestamp modifiedOn;
	private long reservationPaymentId;
	private long paymentTypeId;
	private String paymentTypeName;
	private long reservationId;
	private String accountNumber;
	private String accountName;
	private BigDecimal amount;

	public long getEmailTypeId() {
		return emailTypeId;
	}
	public void setEmailTypeId(long emailTypeId) {
		this.emailTypeId = emailTypeId;
	}
	public String getReferenceNumber() {
		return referenceNumber;
	}
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getMiddleName() {
		return middleName;
	}
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getContactNumber() {
		return contactNumber;
	}
	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public long getRoomTypeId() {
		return roomTypeId;
	}
	public void setRoomTypeId(long roomTypeId) {
		this.roomTypeId = roomTypeId;
	}
	public String getRoomTypeName() {
		return roomTypeName;
	}
	public void setRoomTypeName(String roomTypeName) {
		this.roomTypeName = roomTypeName;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}
	public Timestamp getCheckInDate() {
		return checkInDate;
	}
	public void setCheckInDate(Timestamp checkInDate) {
		this.checkInDate = checkInDate;
	}
	public Timestamp getCheckOutDate() {
		return checkOutDate;
	}
	public void setCheckOutDate(Timestamp checkOutDate) {
		this.checkOutDate = checkOutDate;
	}
	public int getNoOfGuest() {
		return noOfGuest;
	}
	public void setNoOfGuest(int noOfGuest) {
		this.noOfGuest = noOfGuest;
	}
	public int getAdditionalGuest() {
		return additionalGuest;
	}
	public void setAdditionalGuest(int additionalGuest) {
		this.additionalGuest = additionalGuest;
	}
	public int getAdditionalMattress() {
		return additionalMattress;
	}
	public void setAdditionalMattress(int additionalMattress) {
		this.additionalMattress = additionalMattress;
	}
	public BigDecimal getTotalAmountDue() {
		return totalAmountDue;
	}
	public void setTotalAmountDue(BigDecimal totalAmountDue) {
		this.totalAmountDue = totalAmountDue;
	}
	public long getReservationStatusId() {
		return reservationStatusId;
	}
	public void setReservationStatusId(long reservationStatusId) {
		this.reservationStatusId = reservationStatusId;
	}
	public long getStatusId() {
		return statusId;
	}
	public void setStatusId(long statusId) {
		this.statusId = statusId;
	}
	public String getStatusName() {
		return statusName;
	}
	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
	public Timestamp getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}
	public Timestamp getModifiedOn() {
		return modifiedOn;
	}
	public void setModifiedOn(Timestamp modifiedOn) {
		this.modifiedOn = modifiedOn;
	}
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
	
}
