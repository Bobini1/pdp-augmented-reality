package com.team4.engiee;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/server")
public class Server {
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());

    @OnOpen
    public void open(Session session) {
        sessions.add(session);
        System.out.println("Opened new session.");
    }

    @OnMessage
    public void process(String data, Session session) throws IOException {
        System.out.println("Received data: " + data);
        for (Session sessionItem: sessions) {
            if (!sessionItem.equals(session)) {
                sessionItem.getBasicRemote().sendText(data);
            }
        }
    }

    @OnClose
    public void close(Session session) {
        sessions.remove(session);
        System.out.println("Closed session.");
    }
}
