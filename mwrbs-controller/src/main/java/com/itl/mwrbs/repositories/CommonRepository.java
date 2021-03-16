package com.itl.mwrbs.repositories;

import java.util.List;

import com.db.lib.DbWorker;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.itl.mwrbs.models.PaymentType;
import com.itl.mwrbs.models.ReservationStatus;
import com.itl.mwrbs.models.RoomStatus;
import com.itl.mwrbs.models.RoomType;
import com.itl.mwrbs.models.UserType;

public class CommonRepository extends DbWorker {

	public CommonRepository() throws Exception {
		super();
	}
	
	public List<PaymentType> getPaymentTypes() throws Exception {
		SQLResult<List<PaymentType>> sqlResult = SelectRecords("SELECT * FROM dbo.R_PaymentType", SQLCommandType.Text, PaymentType.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomType> getRoomTypes() throws Exception {
		SQLResult<List<RoomType>> sqlResult = SelectRecords("SELECT * FROM dbo.R_RoomType", SQLCommandType.Text, RoomType.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<UserType> getUserTypes() throws Exception {
		SQLResult<List<UserType>> sqlResult = SelectRecords("SELECT * FROM dbo.R_UserType", SQLCommandType.Text, UserType.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomStatus> getRoomStatuses() throws Exception {
		SQLResult<List<RoomStatus>> sqlResult = SelectRecords("SELECT * FROM dbo.R_RoomStatus", SQLCommandType.Text, RoomStatus.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationStatus> getReservationStatuses() throws Exception {
		SQLResult<List<ReservationStatus>> sqlResult = SelectRecords("SELECT * FROM dbo.R_ReservationStatus", SQLCommandType.Text, ReservationStatus.class);
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}

}
