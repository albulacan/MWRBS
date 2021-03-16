package com.db.lib.models;

import java.sql.Timestamp;

public class TransactionTrail {
	private long transactionTrailId;
	private long makerQueueTypeId;
	private long checkerQueueTypeId;
	private long transactionId;
	private long makerRequestStatusId;
	private long checkerRequestStatusId;
	private Timestamp modifiedOn;
	private String modifiedBy;
	
	public TransactionTrail() {
	}
	
	public TransactionTrail(long transactionId, long makerQueueTypeId, long checkerQueueTypeId,
			long makerRequestStatusId, long checkerRequestStatusId, String modifiedBy) {
		this.transactionId = transactionId;
		this.makerQueueTypeId = makerQueueTypeId;
		this.checkerQueueTypeId = checkerQueueTypeId;
		this.makerRequestStatusId = makerRequestStatusId;
		this.checkerRequestStatusId = checkerRequestStatusId;
		this.modifiedBy = modifiedBy;
	}
	
	public long getTransactionTrailId() {
		return transactionTrailId;
	}
	public void setTransactionTrailId(long transactionTrailId) {
		this.transactionTrailId = transactionTrailId;
	}
	public long getMakerQueueTypeId() {
		return makerQueueTypeId;
	}
	public void setMakerQueueTypeId(long makerQueueTypeId) {
		this.makerQueueTypeId = makerQueueTypeId;
	}
	public long getCheckerQueueTypeId() {
		return checkerQueueTypeId;
	}
	public void setCheckerQueueTypeId(long checkerQueueTypeId) {
		this.checkerQueueTypeId = checkerQueueTypeId;
	}
	public long getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(long transactionId) {
		this.transactionId = transactionId;
	}
	public long getMakerRequestStatusId() {
		return makerRequestStatusId;
	}
	public void setMakerRequestStatusId(long makerRequestStatusId) {
		this.makerRequestStatusId = makerRequestStatusId;
	}
	public long getCheckerRequestStatusId() {
		return checkerRequestStatusId;
	}
	public void setCheckerRequestStatusId(long checkerRequestStatusId) {
		this.checkerRequestStatusId = checkerRequestStatusId;
	}
	public Timestamp getModifiedOn() {
		return modifiedOn;
	}
	public void setModifiedOn(Timestamp modifiedOn) {
		this.modifiedOn = modifiedOn;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
}
