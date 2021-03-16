package com.db.lib;

import java.sql.DriverManager;
import java.sql.JDBCType;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import org.apache.log4j.Logger;

import com.db.lib.models.ParameterDirection;
import com.db.lib.models.SQLCommandType;
import com.db.lib.models.SQLConfig;
import com.db.lib.models.SQLParameter;
import com.db.lib.models.SQLResult;
import com.db.lib.utils.ResultSetMapper;
import com.microsoft.sqlserver.jdbc.SQLServerCallableStatement;
import com.microsoft.sqlserver.jdbc.SQLServerConnection;
import com.microsoft.sqlserver.jdbc.SQLServerException;
import com.microsoft.sqlserver.jdbc.SQLServerResultSet;
import com.microsoft.sqlserver.jdbc.SQLServerStatement;

public class DbWorker {
	
	private static final Logger LOGGER = Logger.getLogger(DbWorker.class);
	
	private static SQLConfig sqlConfig;
	private SQLServerConnection conn;
	private ResultSetMapper rsMapper;
	private Queue<SQLParameter> inputParameters;
    private Queue<Map<String, Object>> sqlOutputParameters;

    public Map<String, Object> outputParameters;
	
	public DbWorker() throws Exception {
		sqlConfig = new SQLConfig();
		rsMapper = new ResultSetMapper();
		inputParameters = new LinkedList<SQLParameter>();
		this.setDbConnection();
	}
	
	// PUBLICS
	
	public void dispose() {
		try {
            if (!this.conn.isClosed() && !this.conn.getAutoCommit()) {
                this.conn.rollback();
            }
        } catch (SQLServerException e) {
        	LOGGER.error("Unable to rollback transaction.", e);
        } finally {
            try {
                this.conn.close();
            } catch (SQLServerException e) {
            	LOGGER.error("Unable to close connection.", e);
            }
        }
	}
	
	public void commit() throws SQLServerException {
		try {
            this.conn.commit();
        } catch (SQLServerException e) {
            throw e;
        }
	}
	
	public void AddParameter(String name, Object value, JDBCType type, ParameterDirection direction) {
        if (this.inputParameters == null) {
            this.inputParameters = new LinkedList<SQLParameter>();
        }
        this.inputParameters.add(new SQLParameter(name, value, type, direction));

    }

    public void AddParameter(String name, JDBCType type, ParameterDirection direction) {
        AddParameter(name, null, type, direction);
    }
	
	
	public <T> SQLResult<T> SelectRecord(String command, SQLCommandType commandType, Class<?> targetClass) {
		try {
			if (commandType.equals(SQLCommandType.Text) || commandType.equals(SQLCommandType.Views)) {
				SQLServerStatement sqlStatement = this.getSQLStatement();
		        SQLServerResultSet rs = (SQLServerResultSet) sqlStatement.executeQuery(command);
		        T mappedObject = this.rsMapper.toObject(rs, targetClass);
		        sqlStatement.close();
                return new SQLResult<T>(mappedObject);
			} else {
				command = getSpCallCommand(command);
				SQLServerCallableStatement sqlStatement = this.getSQLCallableStatement(command);
				SQLServerResultSet rs = (SQLServerResultSet) sqlStatement.executeQuery();
				T mappedObject = this.rsMapper.toObject(rs, targetClass);
				this.setOutputParameters(sqlStatement);
				sqlStatement.close();
				return new SQLResult<T>(mappedObject);
			}
		} catch (Exception e) {
			return new SQLResult<T>(e.getMessage());
		}
	}
	
	public <T> SQLResult<List<T>> SelectRecords(String command, SQLCommandType commandType, Class<?> targetClass) {
		try {
			if (commandType.equals(SQLCommandType.Text) || commandType.equals(SQLCommandType.Views)) {
				SQLServerStatement sqlStatement = this.getSQLStatement();
		        SQLServerResultSet rs = (SQLServerResultSet) sqlStatement.executeQuery(command);
		        List<T> mappedObject = this.rsMapper.toList(rs, targetClass);
		        sqlStatement.close();
                return new SQLResult<List<T>>(mappedObject);
			} else {
				command = getSpCallCommand(command);
				SQLServerCallableStatement sqlStatement = this.getSQLCallableStatement(command);
				SQLServerResultSet rs = (SQLServerResultSet) sqlStatement.executeQuery();
				List<T> mappedObject = this.rsMapper.toList(rs, targetClass);
				this.setOutputParameters(sqlStatement);
				sqlStatement.close();
				return new SQLResult<List<T>>(mappedObject);
			}
		} catch (Exception e) {
			return new SQLResult<List<T>>(e.getMessage());
		}
	}
	
	public <T> SQLResult<T> SaveRecordAutoCommit(String command, SQLCommandType commandType) {
		return this.saveRecord(command, commandType, true);
	}
	
	public <T> SQLResult<T> SaveRecordWithoutCommit(String command, SQLCommandType commandType) {
		return this.saveRecord(command, commandType, false);
	}
	
	// END PUBLICS
	
	
	// PRIVATES
	
	private <T> SQLResult<T> saveRecord(String command, SQLCommandType commandType, boolean isAutoCommit) {
		try {
			this.conn.setAutoCommit(isAutoCommit);
			if (commandType.equals(SQLCommandType.Text)) {
				SQLServerStatement sqlStatement = this.getSQLStatement();
				sqlStatement.execute(command);
		        sqlStatement.close();
                return new SQLResult<T>(true);
			} else if (commandType.equals(SQLCommandType.StoredProcedure)) {
				command = getSpCallCommand(command);
				SQLServerCallableStatement sqlStatement = this.getSQLCallableStatement(command);
				sqlStatement.execute();
				this.setOutputParameters(sqlStatement);
				sqlStatement.close();
				return new SQLResult<T>(true);
			} else {
				return new SQLResult<T>("Invalid SQL Command Type for Saving Record: " + commandType.toString());
			}
		} catch (Exception e) {
			return new SQLResult<T>(e.getMessage());
		}
	}
	
	private void setDbConnection() throws ClassNotFoundException, SQLException {
		if (this.conn != null && !this.conn.isClosed()) {
			this.dispose();
		}
		String url = String.format("jdbc:sqlserver://%s:%s;databaseName=%s;", sqlConfig.serverName, sqlConfig.port, sqlConfig.databaseName);
        Class.forName(sqlConfig.driverClassName);
        this.conn = (SQLServerConnection) DriverManager.getConnection(url, sqlConfig.username, sqlConfig.password);
	}
	
	
	private String getSpCallCommand(String sp) {
		StringBuilder sb = new StringBuilder();
        sb.append("{CALL [" + sp + "]");
        if (this.inputParameters != null && this.inputParameters.size() > 0) {
        	sb.append("(");
        	for (int i = 1; i <= inputParameters.size(); i++) {
        		sb.append(i == inputParameters.size() ? "?" : "?,");
        	}
        	sb.append(")");
        }
        sb.append("}");
        return sb.toString();
	}
	
	private SQLServerStatement getSQLStatement() throws SQLServerException {
		SQLServerStatement statement = (SQLServerStatement) this.conn.createStatement();
		statement.setQueryTimeout(sqlConfig.commandTimeout);
		return statement;
	}
	
	private SQLServerCallableStatement getSQLCallableStatement(String cmd) throws SQLServerException {
		SQLServerCallableStatement statement = (SQLServerCallableStatement) this.conn.prepareCall(cmd);
		statement.setQueryTimeout(sqlConfig.commandTimeout);
        this.sqlOutputParameters = new LinkedList<Map<String, Object>>();
        this.outputParameters = new HashMap<String, Object>();
        if (this.inputParameters != null && this.inputParameters.size() > 0) {
            while (!this.inputParameters.isEmpty()) {
                SQLParameter param = this.inputParameters.poll();
                if (param.direction.equals(ParameterDirection.IN)) {
                	statement.setObject(param.name, param.value, param.type);
                } else {
                    this.outputParameters.put(param.name, null);
                    this.sqlOutputParameters.add(this.outputParameters);
                    statement.registerOutParameter(param.name, param.type);
                }
            }
        }
        return statement;
	}
	
	private void setOutputParameters(SQLServerCallableStatement sqlStatement) throws SQLServerException {
		while (!this.sqlOutputParameters.isEmpty()) {
            Map<String, Object> tempResultParam = this.sqlOutputParameters.poll();
            for (Map.Entry<String, Object> entry : tempResultParam.entrySet()) {
                Object value = sqlStatement.getObject(entry.getKey());
                this.outputParameters.put(entry.getKey(), value);
            }
        }
	}
	
	// END PRIVATES

}
