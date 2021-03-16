package com.itl.mwrbs.models;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class RoomDetail {
	
	private long roomMasterId;
	private String roomName;
	private long roomTypeId;
	private String roomTypeName;
	private long roomStatusId;
	private String roomStatusName;
	private BigDecimal rate;
	private int rateEffectivity;
	private BigDecimal additionalRatePerHour;
	private int capacity;
	private int additionalGuestCapacity;
	private BigDecimal additionalGuestRate;
	private BigDecimal mattressRate;
	private String description;
	private String modifiedBy;
	private Timestamp modifiedOn;
	private String createdBy;
	private Timestamp createdOn;
	private int totalRecords;
	
	public long getRoomMasterId() {
		return roomMasterId;
	}
	public void setRoomMasterId(long roomMasterId) {
		this.roomMasterId = roomMasterId;
	}
	public String getRoomName() {
		return roomName;
	}
	public void setRoomName(String roomName) {
		this.roomName = roomName;
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
	public long getRoomStatusId() {
		return roomStatusId;
	}
	public void setRoomStatusId(long roomStatusId) {
		this.roomStatusId = roomStatusId;
	}
	public String getRoomStatusName() {
		return roomStatusName;
	}
	public void setRoomStatusName(String roomStatusName) {
		this.roomStatusName = roomStatusName;
	}
	public BigDecimal getRate() {
		return rate;
	}
	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}
	public int getRateEffectivity() {
		return rateEffectivity;
	}
	public void setRateEffectivity(int rateEffectivity) {
		this.rateEffectivity = rateEffectivity;
	}
	public BigDecimal getAdditionalRatePerHour() {
		return additionalRatePerHour;
	}
	public void setAdditionalRatePerHour(BigDecimal additionalRatePerHour) {
		this.additionalRatePerHour = additionalRatePerHour;
	}
	public int getCapacity() {
		return capacity;
	}
	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}
	public int getAdditionalGuestCapacity() {
		return additionalGuestCapacity;
	}
	public void setAdditionalGuestCapacity(int additionalGuestCapacity) {
		this.additionalGuestCapacity = additionalGuestCapacity;
	}
	public BigDecimal getAdditionalGuestRate() {
		return additionalGuestRate;
	}
	public void setAdditionalGuestRate(BigDecimal additionalGuestRate) {
		this.additionalGuestRate = additionalGuestRate;
	}
	public BigDecimal getMattressRate() {
		return mattressRate;
	}
	public void setMattressRate(BigDecimal mattressRate) {
		this.mattressRate = mattressRate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
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
}
