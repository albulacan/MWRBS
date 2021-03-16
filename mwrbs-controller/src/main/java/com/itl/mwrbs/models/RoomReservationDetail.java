package com.itl.mwrbs.models;

import java.math.BigDecimal;

public class RoomReservationDetail {
	
	private long reservationDetailId;
	private long roomTypeId;
	private String roomTypeName;
	private int noOfGuest;
	private int additionalGuest;
	private int additionalMattress;
	private BigDecimal totalAmountDue;

	public long getReservationDetailId() {
		return reservationDetailId;
	}
	public void setReservationDetailId(long reservationDetailId) {
		this.reservationDetailId = reservationDetailId;
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

}
