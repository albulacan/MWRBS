package com.itl.mwrbs.repositories;

import java.sql.JDBCType;
import java.util.List;

import com.db.lib.DbWorker;
import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.itl.mwrbs.models.DataGridRequest;
import com.itl.mwrbs.models.UserDetail;

public class UserRepository extends DbWorker {

	public UserRepository() throws Exception {
		super();
	}
	
	// GET
	
	public UserDetail authenticateUser(String username, String password) throws Exception {
		SQLResult<UserDetail> sqlResult = new SQLResult<UserDetail>();
		
		AddParameter("Username", username, JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Password", password, JDBCType.NVARCHAR, ParameterDirection.IN);
		
		sqlResult = SelectRecord("usp_mwrbs_AuthenticateUser", SQLCommandType.StoredProcedure, UserDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		
		return sqlResult.getObject();
	}
	
	public List<UserDetail> getDataGridUserDetails(DataGridRequest<UserDetail> request) throws Exception {
		AddParameter("Name", request.getSearch().getName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("UserTypeId", request.getSearch().getUserTypeId() == 0 ? null : request.getSearch().getUserTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("Start", request.getStart(), JDBCType.INTEGER, ParameterDirection.IN);
		AddParameter("Length", request.getLength(), JDBCType.INTEGER, ParameterDirection.IN);
		
		SQLResult<List<UserDetail>> sqlResult = SelectRecords("usp_mwrbs_GetDataGridUserDetails", SQLCommandType.StoredProcedure, UserDetail.class);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		return sqlResult.getObject();
	}
	
	// END GET
	
	// SET
	
	public long enrollUser(UserDetail user) throws Exception {
		long userId = 0;

		AddParameter("Username", user.getUsername(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("Password", user.getPassword(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("UserTypeId", user.getUserTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("FirstName", user.getFirstName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("MiddleName", user.getMiddleName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("LastName", user.getLastName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("EmailAddress", user.getEmailAddress(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ContactNumber", user.getContactNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("CreatedBy", user.getCreatedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("UserMasterId", JDBCType.BIGINT, ParameterDirection.OUT);
		
		SQLResult<?> sqlResult = SaveRecordWithoutCommit("usp_mwrbs_EnrollUser", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
		if (outputParameters.size() > 0) {
			userId = (long) outputParameters.get("UserMasterId");
        }
		
		commit();
		
		return userId;
	}
	
	public void updateUser(UserDetail user) throws Exception {
		AddParameter("UserMasterId", user.getUserMasterId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("UserTypeId", user.getUserTypeId(), JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("FirstName", user.getFirstName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("MiddleName", user.getMiddleName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("LastName", user.getLastName(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("EmailAddress", user.getEmailAddress(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ContactNumber", user.getContactNumber(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("ModifiedBy", user.getModifiedBy(), JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("IsLockedOut", user.isLockedOut(), JDBCType.BIT, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_mwrbs_SetUserDetail", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void setPassword(long userMasterId, String oldPassword, String password) throws Exception {
		AddParameter("UserMasterId", userMasterId, JDBCType.BIGINT, ParameterDirection.IN);
		AddParameter("OldPassword", oldPassword, JDBCType.NVARCHAR, ParameterDirection.IN);
		AddParameter("NewPassword", password, JDBCType.NVARCHAR, ParameterDirection.IN);
		
		SQLResult<?> sqlResult = SaveRecordAutoCommit("usp_mwrbs_ChangePassword", SQLCommandType.StoredProcedure);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	public void deleteUser(long userMasterId) throws Exception {
		SQLResult<?> sqlResult = SaveRecordAutoCommit(String.format("UPDATE dbo.T_UserMaster SET IsDeleted = 1 WHERE UserMasterId = %d;", userMasterId), SQLCommandType.Text);
		
		if (!sqlResult.isSuccess()) {
			throw new Exception(sqlResult.getMessage());
		}
	}
	
	// GET SET

}
