package com.itl.mwrbs.models;

public class DataGridRequest<T> {
    private int draw;
    private int length;
    private T search;
    private int start;

    public DataGridRequest() { }

    public DataGridRequest(int start, T search) {
        this(start, 10, search);
    }
    public DataGridRequest(int start, int length, T search) {
        this.start = start;
        this.length = length;
        this.search = search;
    }

    public int getDraw() {
        return draw;
    }

    public void setDraw(int draw) {
        this.draw = draw;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public T getSearch() {
        return search;
    }

    public void setSearch(T search) {
        this.search = search;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }
}
