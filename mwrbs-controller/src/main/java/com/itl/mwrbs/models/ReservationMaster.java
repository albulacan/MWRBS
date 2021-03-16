package com.itl.mwrbs.models;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public class ReservationMaster {

	private long reservationId;
	private long reservationDetailId;
	private String referenceNumber;
	private int roomCount;
	private Timestamp checkInDate;
	private Timestamp checkOutDate;
	private String firstName;
	private String lastName;
	private String contactNumber;
	private String emailAddress;
	private BigDecimal grandTotal;
	private long statusId;
	private String statusName;
	private Timestamp createdOn;
	private String modifiedBy;
	private Timestamp modifiedOn;
	private List<RoomReservationDetail> roomReservationDetails;
	private List<ReservationPayment> payments;
	private List<RoomAssignment> assignedRooms;
	private int totalRecords;
	private Date dateFrom;
	private Date dateTo;
	
	public long getReservationId() {
		return reservationId;
	}
	public void setReservationId(long reservationId) {
		this.reservationId = reservationId;
	}
	public long getReservationDetailId() {
		return reservationDetailId;
	}
	public void setReservationDetailId(long reservationDetailId) {
		this.reservationDetailId = reservationDetailId;
	}
	public String getReferenceNumber() {
		return referenceNumber;
	}
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	public int getRoomCount() {
		return roomCount;
	}
	public void setRoomCount(int roomCount) {
		this.roomCount = roomCount;
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
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
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
	public BigDecimal getGrandTotal() {
		return grandTotal;
	}
	public void setGrandTotal(BigDecimal grandTotal) {
		this.grandTotal = grandTotal;
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
	public Timestamp getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
	public Timestamp getModifiedOn() {
		return modifiedOn;
	}
	public void setModifiedOn(Timestamp modifiedOn) {
		this.modifiedOn = modifiedOn;
	}
	public List<RoomReservationDetail> getRoomReservationDetails() {
		return roomReservationDetails;
	}
	public void setRoomReservationDetails(List<RoomReservationDetail> roomReservationDetails) {
		this.roomReservationDetails = roomReservationDetails;
	}
	public List<ReservationPayment> getPayments() {
		return payments;
	}
	public void setPayments(List<ReservationPayment> payments) {
		this.payments = payments;
	}
	public List<RoomAssignment> getAssignedRooms() {
		return assignedRooms;
	}
	public void setAssignedRooms(List<RoomAssignment> assignedRooms) {
		this.assignedRooms = assignedRooms;
	}
	public int getTotalRecords() {
		return totalRecords;
	}
	public void setTotalRecords(int totalRecords) {
		this.totalRecords = totalRecords;
	}
	public Date getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}
	public Date getDateTo() {
		return dateTo;
	}
	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}
}
