package com.amap;

public class TestDataInfo {
    private String id;
    private String title;
    private String address;
    private DataLnt Lnt;
    private String assess;
    private String reviews;
    private DataIcon icon;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public DataLnt getLnt() {
        return Lnt;
    }

    public void setLnt(DataLnt lnt) {
        Lnt = lnt;
    }

    public String getAssess() {
        return assess;
    }

    public void setAssess(String assess) {
        this.assess = assess;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }

    public DataIcon getIcon() {
        return icon;
    }

    public void setIcon(DataIcon icon) {
        this.icon = icon;
    }
}
