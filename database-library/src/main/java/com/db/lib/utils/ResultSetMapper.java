package com.db.lib.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import com.microsoft.sqlserver.jdbc.SQLServerResultSet;
import com.microsoft.sqlserver.jdbc.SQLServerResultSetMetaData;

public class ResultSetMapper {

	@SuppressWarnings("unchecked")
	public <T> List<T> toList(SQLServerResultSet rs, Class<?> target) throws Exception {

        Field[] properties = target.getDeclaredFields();
        SQLServerResultSetMetaData metaData = (SQLServerResultSetMetaData) rs.getMetaData();
        List<T> resultList = new ArrayList<T>();
        while (rs.next()) {
            T beanObject = (T) target.getDeclaredConstructor().newInstance();
            for (int i = 1; i <= metaData.getColumnCount(); i++) {
                for (Field field : properties) {
                    if (field.getName().equalsIgnoreCase(metaData.getColumnName(i))) {
                       field.setAccessible(true);
                       field.set(beanObject, rs.getObject(metaData.getColumnName(i)));
                    }
                }
            }
            resultList.add(beanObject);
        }

        return resultList;
    }


    @SuppressWarnings("unchecked")
	public <T> T toObject(SQLServerResultSet rs, Class<?> target) throws Exception {
        Field[] properties = target.getDeclaredFields();
        SQLServerResultSetMetaData metaData = (SQLServerResultSetMetaData) rs.getMetaData();
        T beanObject = null;
        while (rs.next()) {
            beanObject = (T) target.getDeclaredConstructor().newInstance();
            for (int i = 1; i <= metaData.getColumnCount(); i++) {
                for (Field field : properties) {
                    if (field.getName().equalsIgnoreCase(metaData.getColumnName(i))) {
                        field.setAccessible(true);
                        field.set(beanObject, rs.getObject(metaData.getColumnName(i)));
                    }
                }
            }

        }
        return beanObject;
    }
}
