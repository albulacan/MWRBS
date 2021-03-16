package com.db.lib;

import java.sql.JDBCType;
import java.util.List;

import org.junit.Test;

import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLResult;
import com.db.lib.models.TransactionTrail;
import com.microsoft.sqlserver.jdbc.SQLServerException;

public class DbWorkerTest extends DbWorker {

	public DbWorkerTest() throws Exception {
		super();
	}
	
	@Test
	public void selectRecordTest() {
		SQLResult<TransactionTrail> result = new SQLResult<TransactionTrail>();
		
		AddParameter("TransactionId", 1, JDBCType.BIGINT, ParameterDirection.IN);
		
		result = SelectRecord("usp_ibs_GetTransactionTrail", SQLCommandType.StoredProcedure, TransactionTrail.class);
		
		System.out.println(result.isSuccess());
	}
	
	@Test
	public void selectRecordsTest() {
		SQLResult<List<TransactionTrail>> result = new SQLResult<List<TransactionTrail>>();
		
		result = SelectRecords("SELECT * FROM dbo.I_TransactionTrail WHERE TransactionId = 1", SQLCommandType.Text, TransactionTrail.class);
		
		System.out.println(result.isSuccess());
	}
	
	@SuppressWarnings("rawtypes")
	@Test
	public void saveRecord() {
		SQLResult result = new SQLResult();
		
		result = SaveRecordAutoCommit("INSERT INTO [dbo].[I_ApiRawRequest]\r\n" + 
				"           ([RequestBody]\r\n" + 
				"           ,[RequestedOn]\r\n" + 
				"           ,[MessageId])\r\n" + 
				"     VALUES\r\n" + 
				"           ('test'\r\n" + 
				"           ,GETDATE()\r\n" + 
				"           ,'test123')", SQLCommandType.Text);
		
		System.out.println(result.isSuccess());
		
	}
	
	@SuppressWarnings("rawtypes")
	@Test
	public void saveRecordWithoutCommit() throws SQLServerException {
		SQLResult result = new SQLResult();
		
		result = SaveRecordWithoutCommit("INSERT INTO [dbo].[I_ApiRawRequest]\r\n" + 
				"           ([RequestBody]\r\n" + 
				"           ,[RequestedOn]\r\n" + 
				"           ,[MessageId])\r\n" + 
				"     VALUES\r\n" + 
				"           ('test'\r\n" + 
				"           ,GETDATE()\r\n" + 
				"           ,'testfromwithoutcommit')", SQLCommandType.Text);
		
		commit();
		
		System.out.println(result.isSuccess());
		
	}

}
