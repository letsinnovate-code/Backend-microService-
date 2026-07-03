class ApiResponse{
    constructor(statusCode, data, message='success'){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = true || statusCode<400;
    }
}

export {ApiResponse}