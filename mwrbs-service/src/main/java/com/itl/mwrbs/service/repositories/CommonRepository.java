package com.itl.mwrbs.service.repositories;

import java.sql.JDBCType;
import java.util.List;

import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.itl.mwrbs.service.models.EmailNotificationRequest;
import com.itl.mwrbs.service.models.EmailSettings;

public class CommonRepository extends DbWorker {

	public CommonRepository() throws Exception {
		super();
	}
	
	public List<EmailNotificationRequest> getPendingEmailNotificationRequests() throws Exception {
		SQLResult<List<EmailNotificationRequest>> sqlResult = SelectRecords("usp_mwrbs_GetPendingEmailNotifications", SQLCommandType.StoredProcedure, EmailNotificationRequest.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public String getReceptionistEmailAddresses() throws Exception {
		String emailAddresses = "";
		
		AddParameter("EmailAddresses", JDBCType.NVARCHAR, ParameterDirection.OUT);
		
		SQLResult<?> sqlResult = SelectRecord("usp_mwrbs_GetReceptionistEmailAddresses", SQLCommandType.StoredProcedure, EmailNotificationRequest.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		if (outputParameters.size() > 0) {
			emailAddresses = (String) outputParameters.get("EmailAddresses");
        }
		return emailAddresses;
	}
	
	public EmailSettings getEmailSettings() throws Exception {
		SQLResult<EmailSettings> sqlResult = SelectRecord("SELECT * FROM dbo.T_EmailSettings;", SQLCommandType.Text, EmailSettings.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public void updateAutoClosedReservation() throws Exception {
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_mwrbs_UpdateAutoClosedReservation", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setEmailNotificationStatus(EmailNotificationRequest request, boolean isSuccess) throws Exception {
		AddParameter("ReservationStatusId", request.getReservationStatusId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ReservationPaymentId", request.getReservationPaymentId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ReservationId", request.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("IsSuccess", isSuccess, JDBCType.BIT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_mwrbs_SetEmailNotificationStatus", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}

}
