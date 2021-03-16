package com.itl.mwrbs.repositories;

import java.sql.JDBCType;
import java.util.List;

import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.ReservationMaster;
import com.itl.mwrbs.models.ReservationPayment;
import com.itl.mwrbs.models.RoomAssignment;
import com.itl.mwrbs.models.RoomDetail;
import com.itl.mwrbs.models.RoomReservationDetail;

public class ReservationRepository extends DbWorker {

	public ReservationRepository() throws Exception {
		super();
	}
	
	// GET
	
	public List<ReservationMaster> getDataGridReservations(DataGridRequest<ReservationMaster> request) throws Exception {
		AddParameter("ReferenceNumber", request.getSearch().getReferenceNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("StatusId", request.getSearch().getStatusId() == 0 ? null : request.getSearch().getStatusId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		
		SQLResult<List<ReservationMaster>> sqlResult = SelectRecords("usp_mwrbs_GetDataGridReservations", SQLCommandType.StoredProcedure, ReservationMaster.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomReservationDetail> getRoomReservationDetails(long reservationDetailId) throws Exception {
		SQLResult<List<RoomReservationDetail>> sqlResult = SelectRecords(String.format("SELECT R.*, RT.RoomTypeName FROM dbo.I_RoomReservation R LEFT JOIN dbo.R_RoomType RT ON RT.RoomTypeId = R.RoomTypeId WHERE ReservationDetailId = %d;", reservationDetailId), SQLCommandType.Text, RoomReservationDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomAssignment> getRoomAssignment(long reservationDetailId) throws Exception {
		SQLResult<List<RoomAssignment>> sqlResult = SelectRecords(String.format("SELECT A.*, R.RoomName FROM dbo.I_RoomAssignment A LEFT JOIN dbo.T_RoomMaster R ON R.RoomMasterId = A.RoomMasterId WHERE ReservationDetailId = %d;", reservationDetailId), SQLCommandType.Text, RoomAssignment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationPayment> getReservationPayments(long reservationId) throws Exception {
		AddParameter("ReservationId", reservationId, JDBCType.BIGINT, ParameterDirection.IN);
		SQLResult<List<ReservationPayment>> sqlResult = SelectRecords("usp_mwrbs_GetReservationPayments", SQLCommandType.StoredProcedure, ReservationPayment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationMaster> getReservationsByDateRange(DataGridRequest<ReservationMaster> request) throws Exception {
		AddParameter("DateFrom", request.getSearch().getDateFrom(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("DateTo", request.getSearch().getDateTo(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		SQLResult<List<ReservationMaster>> sqlResult = SelectRecords("usp_mwrbs_GetReservationsByDateRange", SQLCommandType.StoredProcedure, ReservationMaster.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationPayment> getReservationPaymentsByDateRange(DataGridRequest<ReservationPayment> request) throws Exception {
		AddParameter("DateFrom", request.getSearch().getDateFrom(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("DateTo", request.getSearch().getDateTo(), JDBCType.DATE, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		SQLResult<List<ReservationPayment>> sqlResult = SelectRecords("usp_mwrbs_GetReservationPaymentsByDateRange", SQLCommandType.StoredProcedure, ReservationPayment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public ReservationMaster getReservationByReferenceNo(String referenceNo) throws Exception {
		SQLResult<ReservationMaster> sqlResult = SelectRecord(String.format("SELECT * FROM dbo.vw_mwrbs_ReservationDetails WHERE ReferenceNumber = '%s'", referenceNo), SQLCommandType.Text, ReservationMaster.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationMaster> getReservations() throws Exception {
		SQLResult<List<ReservationMaster>> sqlResult = SelectRecords("SELECT * FROM dbo.vw_mwrbs_ReservationDetails", SQLCommandType.Text, ReservationMaster.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<ReservationPayment> getReservationPayments() throws Exception {
		SQLResult<List<ReservationPayment>> sqlResult = SelectRecords("SELECT * FROM dbo.I_ReservationPayment", SQLCommandType.Text, ReservationPayment.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	public List<RoomDetail> getAvailableRooms(ReservationMaster detail) throws Exception {
		AddParameter("CheckInDate", detail.getCheckInDate(), JDBCType.TIMESTAMP, ParameterDirection.IN);
		AddParameter("CheckOutDate", detail.getCheckOutDate(), JDBCType.TIMESTAMP, ParameterDirection.IN);
		long roomTypeId = 1;
		if (detail.getRoomReservationDetails() == null || detail.getRoomReservationDetails().isEmpty()) {
			roomTypeId = 0;
		} else {
			for (var i = 0; i < detail.getRoomReservationDetails().size(); i++) {
				if (roomTypeId == 0) {
					break;
				}
				if (i == 0) {
					roomTypeId = detail.getRoomReservationDetails().get(i).getRoomTypeId();
				} else {
					if (detail.getRoomReservationDetails().get(i).getRoomTypeId() != roomTypeId) {
						roomTypeId = 0;
					}
				}
			}
		}
		AddParameter("RoomTypeId", roomTypeId == 0 ? null : roomTypeId, JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ReservationId", detail.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		SQLResult<List<RoomDetail>> sqlResult = SelectRecords("usp_mwrbs_GetAvailableRooms", SQLCommandType.StoredProcedure, RoomDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	// END GET
	
	// SET
	
	public ReservationMaster setReservationMaster(ReservationMaster detail) throws Exception {
		AddParameter("FirstName", detail.getFirstName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("LastName", detail.getLastName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("EmailAddress", detail.getEmailAddress(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ContactNumber", detail.getContactNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ReservationId", JDBCType.BIGINT, ParameterDirection.OUT);
		AddParameter("ReferenceNumber", JDBCType.NVARCHAR, ParameterDirection.OUT);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetReservationMaster", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		if (outputParameters.size() > 0) {
			detail.setReservationId((long) outputParameters.get("ReservationId"));
			detail.setReferenceNumber((String) outputParameters.get("ReferenceNumber"));
        }
		
		return detail;
	}
	
	public long setReservationDetail(ReservationMaster detail) throws Exception {
		long id = 0;
		AddParameter("ReservationId", detail.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomCount", detail.getRoomCount(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("CheckInDate", detail.getCheckInDate(), JDBCType.TIMESTAMP, ParameterDirection.IN);
		AddParameter("CheckOutDate", detail.getCheckOutDate(), JDBCType.TIMESTAMP, ParameterDirection.IN);
		AddParameter("GrandTotal", detail.getGrandTotal(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ReservationDetailId", JDBCType.BIGINT, ParameterDirection.OUT);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetReservationDetail", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		if (outputParameters.size() > 0) {
			id = ((long) outputParameters.get("ReservationDetailId"));
        }
		return id;
	}
	
	public void setRoomReservation(RoomReservationDetail detail) throws Exception {
		AddParameter("ReservationDetailId", detail.getReservationDetailId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomTypeId", detail.getRoomTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("NoOfGuest", detail.getNoOfGuest(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AdditionalGuest", detail.getAdditionalGuest(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("AdditionalMattress", detail.getAdditionalMattress(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("TotalAmountDue", detail.getTotalAmountDue(), JDBCType.DECIMAL, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetRoomReservation", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setRoomAssignment(RoomAssignment detail) throws Exception {
		AddParameter("ReservationDetailId", detail.getReservationDetailId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("RoomMasterId", detail.getRoomMasterId(), JDBCType.BIGINT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetRoomAssignment", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setReservationStatus(ReservationMaster detail) throws Exception {
		AddParameter("ReservationId", detail.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("StatusId", detail.getStatusId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ModifiedBy", detail.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetReservationStatus", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setReservationPayment(ReservationPayment detail) throws Exception {
		AddParameter("PaymentTypeId", detail.getPaymentTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("ReservationId", detail.getReservationId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("AccountNumber", detail.getAccountNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("AccountName", detail.getAccountName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Amount", detail.getAmount(), JDBCType.DECIMAL, ParameterDirection.IN);
		AddParameter("AttachmentPath", detail.getAttachmentPath(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("CreatedOn", detail.getCreatedOn(), JDBCType.TIMESTAMP, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_SetReservationPayment", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	// END SET

}
