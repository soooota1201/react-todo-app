import PropTypes from 'prop-types'

export const Button = ({ color, text, onClick }) => {
  return (
    <div>
      <button
        onClick={ onClick }
        className='btn' style={{ backgroundColor: color }}
      >
        {text}
      </button>
    </div>
  )
}

Button.defaultProps = {
  color: 'steelblue'
}

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func
}