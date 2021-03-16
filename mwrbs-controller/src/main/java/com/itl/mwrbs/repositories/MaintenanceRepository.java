package com.itl.mwrbs.repositories;

import java.sql.JDBCType;
import java.util.List;

import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.db.lib.utils.CryptoUtil;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.EmailSettings;
import com.itl.mwrbs.models.PaymentDetail;
import com.itl.mwrbs.models.RoomDetail;

public class MaintenanceRepository extends DbWorker {

	public MaintenanceRepository() throws Exception {
		super();
	}
	
	// GET
	
	public List<RoomDetail> getRoomRates() throws Exception {
		SQLResult<List<RoomDetail>> sqlResult = SelectRecords("SELECT * FROM dbo.vw_mwrbs_RoomRates;", SQLCommandType.Text, RoomDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public RoomDetail getRoomRate(long roomTypeId) throws Exception {
		SQLResult<RoomDetail> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.vw_mwrbs_RoomRates WHERE RoomTypeId = %d;",
				roomTypeId), SQLCommandType.Text, RoomDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public PaymentDetail getPaymentDetail(long paymentTypeId) throws Exception {
		SQLResult<PaymentDetail> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.vw_mwrbs_PaymentDetails WHERE PaymentTypeId = %d;",
				paymentTypeId), SQLCommandType.Text, PaymentDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public EmailSettings getEmailSettings() throws Exception {
		SQLResult<EmailSettings> sqlResult = SelectRecord("SELECT * FROM dbo.T_EmailSettings;", SQLCommandType.Text, EmailSettings.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomDetail> getDataGridRoomMaster(DataGridRequest<RoomDetail> request) throws Exception {
		AddParameter("RoomTypeId", request.getSearch().getRoomTypeId() == 0 ? null : request.getSearch().getRoomTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomName", request.getSearch().getRoomName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("RoomStatusId", request.getSearch().getRoomStatusId() == 0 ? null : request.getSearch().getRoomStatusId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		
		SQLResult<List<RoomDetail>> sqlResult = SelectRecords("usp_mwrbs_GetDataGridRoomMaster", SQLCommandType.StoredProcedure, RoomDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}

	public List<RoomDetail> getRoomMasters() throws Exception {
		SQLResult<List<RoomDetail>> sqlResult = SelectRecords("SELECT * FROM dbo.vw_mwrbs_RoomDetails", SQLCommandType.Text, RoomDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	// END GET
	
	// SET
	
	public void setRoomRates(RoomDetail detail) throws Exception {
		AddParameter("RoomTypeId", detail.getRoomTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Rate", detail.getRate(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("RateEffectivity", detail.getRateEffectivity(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AdditionalRatePerHour", detail.getAdditionalRatePerHour(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("Capacity", detail.getCapacity(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AdditionalGuestCapacity", detail.getAdditionalGuestCapacity(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AdditionalGuestRate", detail.getAdditionalGuestRate(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("MattressRate", detail.getMattressRate(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("Description", detail.getDescription(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_mwrbs_SetRoomRates", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setPaymentDetail(PaymentDetail detail) throws Exception {		
		AddParameter("PaymentMasterId", detail.getPaymentMasterId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("PaymentTypeId", detail.getPaymentTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("CreatedBy", detail.getCreatedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("AccountNumber", detail.getAccountNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("AccountName", detail.getAccountName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetPaymentDetail", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		
		commit();
	}
	
	public void setEmailSettings(EmailSettings detail) throws Exception {		
		AddParameter("SmtpServer", detail.getSmtpServer(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("SmtpPort", detail.getSmtpPort(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Username", detail.getUsername(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Password", CryptoUtil.encrypt(detail.getPassword()), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetEmailSettings", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		
		commit();
	}
	
	public void setRoomMaster(RoomDetail detail) throws Exception {		
		AddParameter("RoomMasterId", detail.getRoomMasterId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomTypeId", detail.getRoomTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomName", detail.getRoomName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("RoomStatusId", detail.getRoomStatusId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetRoomMaster", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		
		commit();
	}
	
	// END SET

}
