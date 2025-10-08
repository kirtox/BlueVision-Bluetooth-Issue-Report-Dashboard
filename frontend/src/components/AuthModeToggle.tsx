import { useState } from 'react';
import { Form, Card } from 'react-bootstrap';

interface AuthModeToggleProps {
    onModeChange: (useMockAuth: boolean) => void;
}

export const AuthModeToggle: React.FC<AuthModeToggleProps> = ({ onModeChange }) => {
    const [useMockAuth, setUseMockAuth] = useState(() => {
        return localStorage.getItem('useMockAuth') === 'true';
    });

    const handleToggle = (checked: boolean) => {
        setUseMockAuth(checked);
        localStorage.setItem('useMockAuth', checked.toString());
        onModeChange(checked);
    };

    return (
        <Card className="mb-3">
            <Card.Body className="py-2">
                <Form.Check
                    type="switch"
                    id="auth-mode-switch"
                    label={useMockAuth ? "模擬登入模式 (任何帳密都可登入)" : "真實 API 模式 (需要有效帳戶)"}
                    checked={useMockAuth}
                    onChange={(e) => handleToggle(e.target.checked)}
                />
                <small className="text-muted">
                    {useMockAuth
                        ? "目前使用模擬登入，任何電子郵件和密碼都可以登入"
                        : "目前連接到後端 API，需要真實的用戶帳戶"
                    }
                </small>
            </Card.Body>
        </Card>
    );
};