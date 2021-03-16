package com.itl.mwrbs.models;

import java.util.List;

public class DataGridResponse<T> {

    public DataGridResponse(List<T> data, int draw, int recordsTotal) {
        this.data = data;
        this.draw = draw;
        this.recordsTotal = recordsTotal;
    }

    int draw;
    int recordsTotal;
    List<T> data;

    public int getDraw() {
        return draw;
    }

    public void setDraw(int draw) {
        this.draw = draw;
    }

    public int getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(int recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
